FROM node:20-slim

RUN npm install -g @anthropic-ai/claude-code

# Rename the existing node user (UID 1000) to keo_claude
RUN usermod -l keo_claude node && \
    usermod -d /home/keo_claude -m keo_claude && \
    groupmod -n keo_claude node

RUN echo 'alias claude="claude --dangerously-skip-permissions"' >> /home/keo_claude/.bashrc

USER keo_claude
WORKDIR /mnt/c/WSD/Projects/Unorganized/tiff
CMD ["bash"]
