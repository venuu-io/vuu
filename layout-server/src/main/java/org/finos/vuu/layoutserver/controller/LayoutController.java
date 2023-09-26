package org.finos.vuu.layoutserver.controller;

import lombok.RequiredArgsConstructor;
import org.finos.vuu.layoutserver.dto.request.LayoutRequestDTO;
import org.finos.vuu.layoutserver.dto.response.LayoutResponseDTO;
import org.finos.vuu.layoutserver.dto.response.MetadataResponseDTO;
import org.finos.vuu.layoutserver.model.Layout;
import org.finos.vuu.layoutserver.service.LayoutService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping("/layout")
public class LayoutController {

    private final LayoutService layoutService;

    /**
     * Gets the specified layout
     *
     * @param id ID of the layout to get
     * @return the layout
     */
    @GetMapping("/{id}")
    public LayoutResponseDTO getLayout(@PathVariable UUID id) {
        return LayoutResponseDTO.fromEntity(layoutService.getLayout(id));
    }

    /**
     * Gets metadata for all layouts
     *
     * @return the metadata
     */
    @GetMapping("/metadata")
    public List<MetadataResponseDTO> getMetadata() {
        return layoutService.getMetadata().stream().map(MetadataResponseDTO::fromEntity).toList();
    }

    /**
     * Creates a new layout
     *
     * @return the ID of the new layout
     */
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    public UUID createLayout(@RequestBody LayoutRequestDTO layoutToCreate) {
        Layout layout = layoutToCreate.toEntity();

        // TODO: Layout already created, updating instead

        return layoutService.createLayout(layout);
    }

    /**
     * Updates the specified layout
     *
     * @param id        ID of the layout to update
     * @param layoutToUpdate the new data to overwrite the layout with
     */
    @ResponseStatus(HttpStatus.ACCEPTED)
    @PutMapping("/{id}")
    public void updateLayout(@PathVariable UUID id, @RequestBody LayoutRequestDTO layoutToUpdate) {
        Layout layout = layoutToUpdate.toEntity();

        layoutService.updateLayout(id, layout);
    }

    /**
     * Deletes the specified layout
     *
     * @param id ID of the layout to delete
     */
    @ResponseStatus(HttpStatus.ACCEPTED)
    @DeleteMapping("/{id}")
    public void deleteLayout(@PathVariable UUID id) {
        layoutService.deleteLayout(id);
    }
}
